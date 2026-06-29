package com.biar.mapper;

import com.biar.dto.risk.RiskDto;
import com.biar.entity.Risk;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RiskMapper {

    @Mapping(target = "instanceId", source = "instance.id")
    @Mapping(target = "processId", source = "process.id")
    @Mapping(target = "processName", source = "process.name")
    RiskDto toDto(Risk risk);
}
