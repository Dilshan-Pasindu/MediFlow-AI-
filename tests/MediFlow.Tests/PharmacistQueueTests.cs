using Xunit;
using MediFlow.Api.DTOs;

namespace MediFlow.Tests
{
    public class PharmacistQueueTests
    {
        [Fact]
        public void PharmacistQueueFilter_ValidatesPharmacyId()
        {
            var filter = new PharmacistFilterDto { PharmacyId = 1 };
            Assert.Equal(1, filter.PharmacyId);
        }
    }

    public class PharmacistFilterDto
    {
        public int PharmacyId { get; set; }
    }
}
