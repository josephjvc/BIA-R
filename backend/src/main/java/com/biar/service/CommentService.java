package com.biar.service;

import com.biar.dto.comment.*;
import com.biar.entity.*;
import com.biar.exception.ResourceNotFoundException;
import com.biar.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final InstanceCommentRepository commentRepository;
    private final InstanceRepository instanceRepository;

    public CommentService(InstanceCommentRepository commentRepository,
                          InstanceRepository instanceRepository) {
        this.commentRepository = commentRepository;
        this.instanceRepository = instanceRepository;
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getComments(UUID instanceId) {
        return commentRepository.findByInstanceIdOrderByCreatedAtDesc(instanceId)
            .stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public CommentDto createComment(UUID instanceId, CreateCommentRequest req, User user) {
        Instance instance = instanceRepository.findById(instanceId)
            .orElseThrow(() -> new ResourceNotFoundException("Instance not found"));

        var comment = new InstanceComment();
        comment.setInstance(instance);
        comment.setUser(user);
        comment.setContent(req.getContent());
        comment = commentRepository.save(comment);

        return toDto(comment);
    }

    @Transactional
    public CommentDto updateComment(UUID instanceId, UUID commentId, UpdateCommentRequest req, User user) {
        InstanceComment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only edit your own comments");
        }

        if (req.getContent() != null) {
            comment.setContent(req.getContent());
        }
        comment = commentRepository.save(comment);
        return toDto(comment);
    }

    @Transactional
    public void deleteComment(UUID instanceId, UUID commentId, User user) {
        InstanceComment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    private CommentDto toDto(InstanceComment c) {
        var dto = new CommentDto();
        dto.setId(c.getId());
        dto.setInstanceId(c.getInstance().getId());
        dto.setUserId(c.getUser().getId());
        dto.setUserDisplayName(c.getUser().getDisplayName());
        dto.setContent(c.getContent());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }
}
