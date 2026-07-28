package com.br.oticavitturino.main.model.service.scheduling;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.br.oticavitturino.main.infra.email.SendEmailMessage;
import com.br.oticavitturino.main.infra.security.EncryptionService;
import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.br.oticavitturino.main.model.domain.scheduling.AvailableSlot;
import com.br.oticavitturino.main.model.domain.scheduling.DateAvailableDTO;
import com.br.oticavitturino.main.model.domain.scheduling.Scheduling;
import com.br.oticavitturino.main.model.domain.scheduling.SchedulingDTO;
import com.br.oticavitturino.main.model.domain.scheduling.SchedulingEnum;
import com.br.oticavitturino.main.model.domain.scheduling.StatusEnum;
import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.repository.scheduling.AvailableSlotRepository;
import com.br.oticavitturino.main.model.repository.scheduling.SchedulingRepository;

import org.springframework.transaction.annotation.Transactional;

@Service
public class SchedulingService {

    @Autowired
    private SchedulingRepository repository;

    @Autowired
    private AvailableSlotRepository availableSlotRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SendEmailMessage sendMailMessage;

    @Autowired
    private EncryptionService encryptionService;

    // Administrador pode adicionar datas disponíveis para agendamento;
    @Transactional
    public List<DateAvailableDTO> addDateAvailable(List<DateAvailableDTO> dateAvailableDTOs) {
        List<AvailableSlot> slots = dateAvailableDTOs.stream()
                .map(dto -> new AvailableSlot(dto.date_available()))
                .collect(Collectors.toList());
        availableSlotRepository.saveAll(slots);
        return slots.stream()
                .map(slot -> new DateAvailableDTO(slot.getSlotDate()))
                .collect(Collectors.toList());
    }

    // Administrador pode excluir datas disponíveis para agendamento;
    @Transactional
    public void deleteDateAvailable(DateAvailableDTO schedulingDTO) {
        Optional.ofNullable(availableSlotRepository.findBySlotDate(schedulingDTO.date_available()))
                .ifPresent(availableSlotRepository::delete);
    }

    // Administrador pode confirmar/cancelar um agendamento;
    @Transactional
    public void confirmOrCancelAppointment(Long SchedulingId, StatusEnum status) {
        Scheduling scheduling = repository.findById(SchedulingId)
                .orElseThrow(() -> new IllegalArgumentException("Scheduling not found in the database!"));

        Customer customer = scheduling.getCustomer();
        String customerEmail = decryptField(customer.getEmail());
        String customerName = decryptField(customer.getName());

        if (status == StatusEnum.CONCLUIDO) {
            scheduling.setStatus(StatusEnum.CONCLUIDO);
            sendMailMessage.sendEmailNotification(customerEmail, "Consulta Confirmada", customerName, "Seu agendamento foi confirmado com sucesso!");
        } else if (status == StatusEnum.CANCELADO) {
            scheduling.setStatus(StatusEnum.CANCELADO);
            sendMailMessage.sendEmailNotification(customerEmail, "Consulta Cancelada", customerName, "Seu agendamento foi cancelado.");
        }
        repository.save(scheduling);
    }

    // Administrador pode visualizar todos os agendamentos;
    @Transactional(readOnly = true)
    public List<SchedulingDTO> getAllSchedulings() {
        return repository.findAll().stream()
                .filter(scheduling -> scheduling.getCustomer() != null)
                .map(s -> new SchedulingDTO(
                        s.getId(),
                        decryptField(s.getCustomer().getName()),
                        s.getSchedulingType(),
                        s.getSchedulingDate(),
                        s.getStatus()))
                .collect(Collectors.toList());
    }

    // Cliente autenticado visualiza os próprios agendamentos;
    @Transactional(readOnly = true)
    public List<SchedulingDTO> getMySchedulings() {
        Customer customer = requireAuthenticatedCustomer();
        return repository.findByCustomerId(customer.getId()).stream()
                .map(s -> new SchedulingDTO(
                        s.getId(),
                        decryptField(customer.getName()),
                        s.getSchedulingType(),
                        s.getSchedulingDate(),
                        s.getStatus()))
                .collect(Collectors.toList());
    }

    // Cliente pode visualizar as datas disponíveis para agendamento;
    @Transactional(readOnly = true)
    public List<DateAvailableDTO> getAllDatesAvailable() {
        return availableSlotRepository.findAll().stream()
                .map(slot -> new DateAvailableDTO(slot.getSlotDate()))
                .collect(Collectors.toList());
    }

    // Cliente pode agendar uma consulta;
    @Transactional
    public SchedulingDTO scheduleAppointment(SchedulingDTO schedulingDTO) {
        AvailableSlot slot = Optional.ofNullable(availableSlotRepository.findBySlotDate(schedulingDTO.schedulingDate()))
                .orElseThrow(() -> new IllegalArgumentException("Horário não disponível para agendamento."));

        Customer customer = resolveCustomerForScheduling(schedulingDTO);
        Scheduling scheduling = findReusableScheduling(customer);

        applySchedulingPoints(customer, schedulingDTO.scheduling_type());

        scheduling.setSchedulingDate(slot.getSlotDate());
        scheduling.setCustomer(customer);
        scheduling.setSchedulingType(schedulingDTO.scheduling_type());
        scheduling.setStatus(StatusEnum.PENDENTE);
        repository.save(scheduling);
        availableSlotRepository.delete(slot);

        return new SchedulingDTO(
                scheduling.getId(),
                decryptField(customer.getName()),
                scheduling.getSchedulingType(),
                scheduling.getSchedulingDate(),
                scheduling.getStatus()
        );
    }

    // Cliente pode cancelar um agendamento;
    @Transactional
    public void cancelAppointment(Long schedulingId) {
        Scheduling scheduling = repository.findById(schedulingId)
                .orElseThrow(() -> new IllegalArgumentException("Agendamento não encontrado."));
        Customer customer = scheduling.getCustomer();
        if (customer == null) {
            throw new IllegalArgumentException("Cliente não encontrado para este agendamento.");
        }

        if (scheduling.getStatus() == StatusEnum.CANCELADO) {
            throw new IllegalArgumentException("Este agendamento já está cancelado.");
        }

        // Remove Pontuação para Consulta
        if (scheduling.getSchedulingType() == SchedulingEnum.CONSULTA) {
            customer.setPoints(Math.max(0, customer.getPoints() - 30));
        }

        // Remove Pontuação para Manutenção
        else if (scheduling.getSchedulingType() == SchedulingEnum.MANUTENCAO) {
            customer.setPoints(Math.max(0, customer.getPoints() - 15));
        }

        // Remove Pontuação para Limpeza
        else if (scheduling.getSchedulingType() == SchedulingEnum.LIMPEZA) {
            customer.setPoints(Math.max(0, customer.getPoints() - 10));
        }

        // Devolve o horário à lista de datas disponíveis
        availableSlotRepository.save(new AvailableSlot(scheduling.getSchedulingDate()));

        scheduling.setStatus(StatusEnum.CANCELADO);
        repository.save(scheduling);
    }

    private Scheduling findReusableScheduling(Customer customer) {
        List<Scheduling> existing = repository.findByCustomerId(customer.getId());
        if (existing.isEmpty()) {
            return new Scheduling();
        }

        Scheduling current = existing.get(0);
        if (current.getStatus() == StatusEnum.PENDENTE || current.getStatus() == StatusEnum.CONCLUIDO) {
            throw new IllegalArgumentException(
                    "Você já possui um agendamento ativo. Cancele o atual antes de criar outro.");
        }

        // CANCELADO: reutiliza o mesmo registro (customer_id é único)
        return current;
    }

    private void applySchedulingPoints(Customer customer, SchedulingEnum type) {
        if (type == SchedulingEnum.CONSULTA) {
            customer.setPoints(customer.getPoints() + 30);
        } else if (type == SchedulingEnum.MANUTENCAO) {
            customer.setPoints(customer.getPoints() + 15);
        } else if (type == SchedulingEnum.LIMPEZA) {
            customer.setPoints(customer.getPoints() + 10);
        }
    }

    private Customer resolveCustomerForScheduling(SchedulingDTO schedulingDTO) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Customer customer) {
            return customer;
        }

        return Optional.ofNullable(customerRepository.findByName(schedulingDTO.name()))
                .orElseThrow(() -> new IllegalArgumentException("Customer not found in the database!"));
    }

    private Customer requireAuthenticatedCustomer() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Customer customer) {
            return customer;
        }
        throw new IllegalArgumentException("Authenticated customer required");
    }

    private String decryptField(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }

        try {
            return encryptionService.decrypt(value);
        } catch (RuntimeException exception) {
            return value;
        }
    }
}