package com.biar.mapper;

import com.biar.dto.UserDto;
import com.biar.dto.auth.RegisterRequest;
import com.biar.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "displayName", expression = "java(req.getName() + \" \" + req.getLastName())")
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "avatarUrl", ignore = true)
    @Mapping(target = "organization", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toEntity(RegisterRequest req);

    @Mapping(target = "organizationName", source = "organization.name")
    UserDto toDto(User user);
}
