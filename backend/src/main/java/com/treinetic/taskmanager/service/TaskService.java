package com.treinetic.taskmanager.service;

import com.treinetic.taskmanager.dto.TaskDTO;
import com.treinetic.taskmanager.exception.ResourceNotFoundException;
import com.treinetic.taskmanager.model.Task;
import com.treinetic.taskmanager.model.Task.TaskStatus;
import com.treinetic.taskmanager.model.User;
import com.treinetic.taskmanager.repository.TaskRepository;
import com.treinetic.taskmanager.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated user found");
        }

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated user not found: " + username));
    }

    public List<TaskDTO> getAllTasks() {
        User user = getCurrentUser();
        return taskRepository.findByUserId(user.getId())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<TaskDTO> getTasksByStatus(TaskStatus status) {
        User user = getCurrentUser();
        return taskRepository.findByUserIdAndStatus(user.getId(), status)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TaskDTO getTaskById(Long id) {
        User user = getCurrentUser();
        Task task = taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Task not found with id: " + id));
        return toDTO(task);
    }

    public TaskDTO createTask(TaskDTO dto) {
        User user = getCurrentUser();
        Task task = toEntity(dto);
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : TaskStatus.TO_DO);
        task.setUser(user);
        return toDTO(taskRepository.save(task));
    }

    @Transactional
    public TaskDTO updateTask(Long id, TaskDTO dto) {
        User user = getCurrentUser();
        Task existing = taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Task not found with id: " + id));
        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setStatus(dto.getStatus());
        return toDTO(taskRepository.save(existing));
    }

    public void deleteTask(Long id) {
        User user = getCurrentUser();
        Task task = taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Task not found with id: " + id));
        taskRepository.delete(task);
    }

    private TaskDTO toDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }

    private Task toEntity(TaskDTO dto) {
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        return task;
    }
}