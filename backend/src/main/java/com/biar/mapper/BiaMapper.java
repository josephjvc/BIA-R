package com.biar.mapper;

import com.biar.dto.bia.BiaAssessmentDto;
import com.biar.entity.BiaAssessment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BiaMapper {

    @Mapping(target = "instanceId", source = "instance.id")
    @Mapping(target = "processId", source = "process.id")
    @Mapping(target = "processName", source = "process.name")
    @Mapping(target = "assessedBy", source = "assessedBy.id")
    @Mapping(target = "assessedByName", source = "assessedBy.displayName")
    BiaAssessmentDto toDto(BiaAssessment assessment);
}
