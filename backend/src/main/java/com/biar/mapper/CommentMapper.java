package com.biar.mapper;

import com.biar.dto.comment.CommentDto;
import com.biar.entity.InstanceComment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(target = "instanceId", source = "instance.id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userDisplayName", source = "user.displayName")
    CommentDto toDto(InstanceComment comment);
}
