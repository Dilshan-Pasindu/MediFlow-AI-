using Microsoft.AspNetCore.SignalR;

namespace MediFlow.Api.Hubs;

public class ConsultationEventPayload
{
    public int AppointmentId { get; set; }
    public string? AppointmentNumber { get; set; }
    public int DoctorId { get; set; }
    public string? DoctorName { get; set; }
    public string? PatientName { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
}

public interface IConsultationClient
{
    Task ConsultationStarted(ConsultationEventPayload payload);
    Task ConsultationEnded(ConsultationEventPayload payload);
}

/// <summary>
/// SignalR hub for real-time consultation tracking between doctors and patients.
/// Clients can subscribe to specific doctor queues (e.g. "doctor-{doctorId}")
/// or listen to global broadcasts.
/// </summary>
public class ConsultationHub : Hub<IConsultationClient>
{
    public async Task JoinDoctorQueue(int doctorId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"doctor-{doctorId}");
    }

    public async Task LeaveDoctorQueue(int doctorId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"doctor-{doctorId}");
    }
}
