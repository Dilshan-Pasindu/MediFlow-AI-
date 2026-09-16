using System;

namespace MediFlow.Api.Exceptions
{
    public class OrderNotFoundException : Exception
    {
        public OrderNotFoundException(int orderId)
            : base($"Medicine Order with ID '{orderId}' was not found.") { }
    }
}
