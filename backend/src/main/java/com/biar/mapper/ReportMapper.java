package com.biar.mapper;

import com.biar.dto.report.ReportDto;
import com.biar.entity.Report;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReportMapper {

    @Mapping(target = "instanceId", source = "instance.id")
    @Mapping(target = "type", expression = "java(report.getType().getValue())")
    @Mapping(target = "generatedBy", source = "generatedBy.id")
    @Mapping(target = "generatedByName", source = "generatedBy.displayName")
    ReportDto toDto(Report report);
}
