using Xunit;
using MediFlow.Api.DTOs;

namespace MediFlow.Tests
{
    public class OrderDtoMappingTests
    {
        [Fact]
        public void CreateOrderRequestDto_MapsPrescriptionIdAndPharmacyId()
        {
            var dto = new CreateOrderRequestDto(
                PrescriptionId: 10,
                PatientId: 5,
                PharmacyId: 1,
                Items: null,
                DeliveryAddress: "123 Main St",
                Notes: "Urgent"
            );

            Assert.Equal(10, dto.PrescriptionId);
            Assert.Equal(5, dto.PatientId);
            Assert.Equal(1, dto.PharmacyId);
            Assert.Equal("123 Main St", dto.DeliveryAddress);
            Assert.Equal("Urgent", dto.Notes);
        }
    }
}
