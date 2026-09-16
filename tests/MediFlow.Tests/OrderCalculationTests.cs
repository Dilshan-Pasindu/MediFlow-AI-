using Xunit;

namespace MediFlow.Tests
{
    public class OrderCalculationTests
    {
        [Fact]
        public void OrderSubtotal_CalculatesQuantityTimesUnitPrice()
        {
            decimal unitPrice = 150.50m;
            int quantity = 3;
            decimal total = unitPrice * quantity;

            Assert.Equal(451.50m, total);
        }
    }
}
