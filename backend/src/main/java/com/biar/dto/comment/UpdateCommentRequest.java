package com.biar.dto.comment;

import jakarta.validation.constraints.NotBlank;

public class UpdateCommentRequest {

    @NotBlank
    private String content;

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
