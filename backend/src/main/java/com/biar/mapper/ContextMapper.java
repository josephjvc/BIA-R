package com.biar.mapper;

import com.biar.dto.context.BusinessProcessDto;
import com.biar.dto.context.CreateProcessRequest;
import com.biar.dto.context.ProcessActivityDto;
import com.biar.entity.BusinessProcess;
import com.biar.entity.ProcessActivity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ContextMapper {

    @Mapping(target = "instanceId", source = "instance.id")
    @Mapping(target = "activities", ignore = true)
    BusinessProcessDto toProcessDto(BusinessProcess process);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "instance", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void applyCreate(@MappingTarget BusinessProcess process, CreateProcessRequest req);

    @Mapping(target = "processId", source = "process.id")
    ProcessActivityDto toActivityDto(ProcessActivity activity);
}
