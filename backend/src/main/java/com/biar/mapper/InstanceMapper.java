package com.biar.mapper;

import com.biar.dto.instance.InstanceDto;
import com.biar.dto.instance.InstanceSummaryDto;
import com.biar.entity.Instance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InstanceMapper {

    @Mapping(target = "organizationId", source = "organization.id")
    @Mapping(target = "createdBy", source = "createdBy.id")
    @Mapping(target = "createdByName", source = "createdBy.displayName")
    InstanceDto toDto(Instance instance);

    @Mapping(target = "createdByName", source = "createdBy.displayName")
    @Mapping(target = "org", source = "organization.name")
    InstanceSummaryDto toSummary(Instance instance);
}
