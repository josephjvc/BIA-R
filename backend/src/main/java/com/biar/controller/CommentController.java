package com.biar.controller;

import com.biar.dto.comment.*;
import com.biar.entity.User;
import com.biar.security.CurrentUser;
import com.biar.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/instances/{instanceId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable UUID instanceId) {
        return ResponseEntity.ok(commentService.getComments(instanceId));
    }

    @PostMapping
    public ResponseEntity<CommentDto> createComment(@PathVariable UUID instanceId,
                                                     @Valid @RequestBody CreateCommentRequest req,
                                                     @CurrentUser User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(commentService.createComment(instanceId, req, user));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDto> updateComment(@PathVariable UUID instanceId,
                                                     @PathVariable UUID commentId,
                                                     @Valid @RequestBody UpdateCommentRequest req,
                                                     @CurrentUser User user) {
        return ResponseEntity.ok(commentService.updateComment(instanceId, commentId, req, user));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable UUID instanceId,
                                               @PathVariable UUID commentId,
                                               @CurrentUser User user) {
        commentService.deleteComment(instanceId, commentId, user);
        return ResponseEntity.noContent().build();
    }
}
