using System;

namespace MediFlow.Api.Exceptions
{
    public class OrderPaymentException : Exception
    {
        public OrderPaymentException(int orderId, string message)
            : base($"Payment failed for order '{orderId}': {message}") { }
    }
}
