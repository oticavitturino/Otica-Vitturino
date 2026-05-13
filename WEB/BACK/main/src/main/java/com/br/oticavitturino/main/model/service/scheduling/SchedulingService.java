package com.br.oticavitturino.main.model.service.scheduling;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.br.oticavitturino.main.model.domain.scheduling.DateAvailableDTO;
import com.br.oticavitturino.main.model.domain.scheduling.Scheduling;
import com.br.oticavitturino.main.model.repository.scheduling.SchedulingRepository;

@Service
public class SchedulingService {

    @Autowired
    private SchedulingRepository repository;

    public DateAvailableDTO addDateAvailable(DateAvailableDTO schedulingDTO) {
        Scheduling scheduling = new Scheduling(schedulingDTO.date_available());
        repository.save(scheduling);
        return new DateAvailableDTO(scheduling.getScheduling_date());
    }

    public List<DateAvailableDTO> getAllDatesAvailable() {
        List<Scheduling> schedulings = repository.findAll();
        return schedulings.stream()
                .map(s -> new DateAvailableDTO(s.getScheduling_date()))
                .toList();
    }
}
