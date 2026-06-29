package com.biar.mapper;

import com.biar.dto.export.ExportDto;
import com.biar.entity.InstanceExport;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExportMapper {

    @Mapping(target = "instanceId", source = "instance.id")
    @Mapping(target = "exportedBy", source = "exportedBy.id")
    @Mapping(target = "exportedByName", source = "exportedBy.displayName")
    ExportDto toDto(InstanceExport export);
}
