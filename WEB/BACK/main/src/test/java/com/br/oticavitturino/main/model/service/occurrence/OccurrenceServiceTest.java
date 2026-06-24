package com.br.oticavitturino.main.model.service.occurrence;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.br.oticavitturino.main.model.domain.occurrence.Occurrence;
import com.br.oticavitturino.main.model.domain.occurrence.OccurrenceDTO;
import com.br.oticavitturino.main.model.domain.occurrence.OccurrenceListDTO;
import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.repository.occurrence.OccurrenceRepository;

@ExtendWith(MockitoExtension.class)
public class OccurrenceServiceTest {

    @Mock
    private OccurrenceRepository repository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private OccurrenceService service;

    private Occurrence occurrence;
    private OccurrenceDTO dto;
    private Customer customer;

    @BeforeEach
    void setUp() {
        customer = new Customer();
        customer.setId(1L);
        customer.setName("João Silva");

        occurrence = new Occurrence("Aro do óculos quebrado", LocalDateTime.now(), "ocorrencia", customer);
        
        dto = new OccurrenceDTO(1L, "Aro do óculos quebrado", LocalDateTime.now(), "ocorrencia", 1L, "João Silva");
    }

    @Test
    void testCreateOccurrence() {
        // Arrange
        when(customerRepository.findByName(dto.customerName())).thenReturn(customer);
        
        Occurrence savedOccurrence = new Occurrence();
        savedOccurrence.setId(1L);
        savedOccurrence.setDescription(dto.description());
        savedOccurrence.setSentAt(dto.sentAt());
        savedOccurrence.setCategory(dto.category());
        savedOccurrence.setCustomer(customer);
        
        when(repository.save(any(Occurrence.class))).thenReturn(savedOccurrence);

        // Act
        OccurrenceDTO result = service.createOccurrence(dto);

        // Assert
        assertNotNull(result);
        assertEquals(dto.description(), result.description());
        assertEquals(dto.category(), result.category());
        assertEquals(dto.customerName(), result.customerName());
        verify(repository, times(1)).save(any(Occurrence.class));
    }

    @Test
    void testDeleteOccurrence() {
        // Arrange
        Long id = 1L;
        when(repository.findById(id)).thenReturn(Optional.of(occurrence));

        // Act
        service.deleteOccurrence(id);

        // Assert
        verify(repository, times(1)).findById(id);
        verify(repository, times(1)).delete(occurrence);
    }

    @Test
    void testDeleteOccurrenceNotFound() {
        // Arrange
        Long id = 1L;
        when(repository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            service.deleteOccurrence(id);
        });
        
        assertEquals("Occurrence not found with id: 1", exception.getMessage());
        verify(repository, times(1)).findById(id);
        verify(repository, never()).delete(any());
    }

    @Test
    void testGetOccurrencesByCustomerId() {
        // Arrange
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(repository.findByCustomerId(1L)).thenReturn(Arrays.asList(occurrence));

        // Act
        List<OccurrenceListDTO> result = service.getOccurrencesByCustomerId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(occurrence.getDescription(), result.get(0).description());
        verify(repository, times(1)).findByCustomerId(1L);
    }

    @Test
    void testGetAllOccurrences() {
        // Arrange
        Occurrence mockOccurrence = mock(Occurrence.class);
        when(mockOccurrence.getId()).thenReturn(1L);
        when(mockOccurrence.getDescription()).thenReturn("Aro do óculos quebrado");
        when(mockOccurrence.getSentAt()).thenReturn(LocalDateTime.now());
        when(mockOccurrence.getCategory()).thenReturn("Óculos");
        when(mockOccurrence.getCustomer()).thenReturn(customer);
        
        when(repository.findAll()).thenReturn(Arrays.asList(mockOccurrence));

        // Act
        List<OccurrenceDTO> result = service.getAllOccurrences();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Óculos", result.get(0).category());
        assertEquals("João Silva", result.get(0).customerName());
        verify(repository, times(1)).findAll();
    }
}
