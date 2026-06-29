package com.biar.mapper;

import com.biar.dto.instance.InstanceDto;
import com.biar.dto.instance.InstanceSummaryDto;
import com.biar.entity.Instance;
import com.biar.entity.InstanceStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InstanceMapper {

    @Mapping(target = "organizationId", expression = "java(instance.getOrganization() != null ? instance.getOrganization().getId() : null)")
    @Mapping(target = "createdBy", source = "createdBy.id")
    @Mapping(target = "createdByName", source = "createdBy.displayName")
    @Mapping(target = "status", expression = "java(instance.getStatus() != null ? instance.getStatus().getValue() : null)")
    InstanceDto toDto(Instance instance);

    @Mapping(target = "createdByName", source = "createdBy.displayName")
    @Mapping(target = "org", expression = "java(instance.getOrganization() != null ? instance.getOrganization().getName() : null)")
    @Mapping(target = "status", expression = "java(instance.getStatus() != null ? instance.getStatus().getValue() : null)")
    InstanceSummaryDto toSummary(Instance instance);
}
