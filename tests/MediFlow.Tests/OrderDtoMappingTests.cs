using Xunit;
using MediFlow.Api.DTOs;
using System.Collections.Generic;

namespace MediFlow.Tests
{
    public class OrderDtoMappingTests
    {
        [Fact]
        public void CreateOrderDto_MapsPrescriptionIdAndPharmacyId()
        {
            var dto = new CreateOrderDto
            {
                PrescriptionId = 10,
                PharmacyId = 1
            };

            Assert.Equal(10, dto.PrescriptionId);
            Assert.Equal(1, dto.PharmacyId);
        }

        [Fact]
        public void CreateOrderRequestDto_ValidatesLineItems()
        {
            var dto = new CreateOrderRequestDto(
                PrescriptionId: 101,
                PatientId: 5,
                PharmacyId: 2,
                Items: new List<CreateOrderItemDto>(),
                DeliveryAddress: "123 Main St",
                Notes: "Urgent"
            );

            Assert.Equal(101, dto.PrescriptionId);
            Assert.Equal(2, dto.PharmacyId);
            Assert.NotNull(dto.Items);
            Assert.Empty(dto.Items);
        }
    }
}
