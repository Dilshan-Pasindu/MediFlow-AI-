using Xunit;
using MediFlow.Api.DTOs;

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
    }
}
