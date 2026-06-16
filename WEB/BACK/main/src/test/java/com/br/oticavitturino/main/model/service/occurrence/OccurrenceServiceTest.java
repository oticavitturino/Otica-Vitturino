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

import com.br.oticavitturino.main.model.domain.occurrence.Occurrence;
import com.br.oticavitturino.main.model.domain.occurrence.OccurrenceDTO;
import com.br.oticavitturino.main.model.domain.occurrence.OccurrenceNoCustomerDTO;
import com.br.oticavitturino.main.model.repository.occurrence.OccurrenceRepository;

@ExtendWith(MockitoExtension.class)
public class OccurrenceServiceTest {

    @Mock
    private OccurrenceRepository repository;

    @InjectMocks
    private OccurrenceService service;

    private Occurrence occurrence;
    private OccurrenceNoCustomerDTO dto;

    @BeforeEach
    void setUp() {
        occurrence = new Occurrence("Aro do óculos quebrado", LocalDateTime.now());
        dto = new OccurrenceNoCustomerDTO(1L, "Aro do óculos quebrado", LocalDateTime.now());
    }

    @Test
    void testCreateOccurrence() {
        // Arrange
        Occurrence savedOccurrence = mock(Occurrence.class);
        when(savedOccurrence.getId()).thenReturn(1L);
        when(savedOccurrence.getDescription()).thenReturn(dto.description());
        when(savedOccurrence.getSentAt()).thenReturn(dto.sentAt());
        when(repository.save(any(Occurrence.class))).thenReturn(savedOccurrence);

        // Act
        OccurrenceNoCustomerDTO result = service.createOccurrence(dto);

        // Assert
        assertNotNull(result);
        assertEquals(dto.description(), result.description());
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
        Exception exception = assertThrows(RuntimeException.class, () -> {
            service.deleteOccurrence(id);
        });
        
        assertEquals("Occurrence not found with id: 1", exception.getMessage());
        verify(repository, times(1)).findById(id);
        verify(repository, never()).delete(any());
    }

    @Test
    void testGetAllOccurrences() {
        // Arrange
        Occurrence mockOccurrence = mock(Occurrence.class);
        when(mockOccurrence.getId()).thenReturn(1L);
        when(mockOccurrence.getDescription()).thenReturn("Aro do óculos quebrado");
        when(mockOccurrence.getSentAt()).thenReturn(LocalDateTime.now());
        when(mockOccurrence.getCustomerOccurrence()).thenReturn(null);
        
        when(repository.findAll()).thenReturn(Arrays.asList(mockOccurrence));

        // Act
        List<OccurrenceDTO> result = service.getAllOccurrences();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(repository, times(1)).findAll();
    }
}
