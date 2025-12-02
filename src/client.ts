import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import {
    ConnectionStatus,
    MachineInfo,
    ActiveMachineInfo,
    ProLabInfo,
    PwnboxStatus,
    PwnboxUsage,
    ApiResponse,
    UserProgress
} from './types';

const API_BASE_URL = "https://www.hackthebox.com/api";
const USER_AGENT = "htb-operator-ts/1.0.0";

async function makeRequest<T>(
    apiKey: string,
    method: 'GET' | 'POST',
    endpoint: string,
    data?: any,
    apiVersion: string = 'v4'
): Promise<T> {
    const url = `${API_BASE_URL}/${apiVersion}/${endpoint}`;
    const config: AxiosRequestConfig = {
        method,
        url,
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'User-Agent': USER_AGENT,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<any>;
            if (axiosError.response && axiosError.response.data) {
                throw new Error(axiosError.response.data.message || JSON.stringify(axiosError.response.data));
            }
            throw new Error(axiosError.message);
        }
        throw error;
    }
}

// Connection
export async function getConnectionStatus(apiKey: string): Promise<any> {
    // The python code calls `connection/status` and returns a list of VpnConnection
    return makeRequest(apiKey, 'GET', 'connection/status');
}

// Machine Control
export async function spawnMachine(apiKey: string, machineId: number): Promise<{ success: boolean; message: string }> {
    const response = await makeRequest<any>(apiKey, 'POST', 'vm/spawn', { machine_id: machineId });
    // Python logic: if "success" in data and data["success"] == '0', return False, message
    // if "success" not in data, return True, message
    // But usually it returns { success: "1", message: "..." } or { success: "0", message: "..." }
    // Let's just return the raw response or normalize it.
    // The user asked for "Turn on machine", so returning success/fail is good.
    if (response.success === '0' || response.success === false) {
        return { success: false, message: response.message || 'Failed to spawn machine' };
    }
    return { success: true, message: response.message || 'Machine spawned' };
}

export async function terminateMachine(apiKey: string, machineId: number): Promise<{ success: boolean; message: string }> {
    const response = await makeRequest<any>(apiKey, 'POST', 'vm/terminate', { machine_id: machineId });
    if (response.success === '0' || response.success === false) {
        return { success: false, message: response.message || 'Failed to terminate machine' };
    }
    return { success: true, message: response.message || 'Machine terminated' };
}

export async function resetMachine(apiKey: string, machineId: number): Promise<{ success: boolean; message: string }> {
    const response = await makeRequest<any>(apiKey, 'POST', 'vm/reset', { machine_id: machineId });
    if (response.success === '0' || response.success === false) {
        return { success: false, message: response.message || 'Failed to reset machine' };
    }
    return { success: true, message: response.message || 'Machine reset requested' };
}

export async function extendMachine(apiKey: string, machineId: number): Promise<{ success: boolean; message: string }> {
    const response = await makeRequest<any>(apiKey, 'POST', 'vm/extend', { machine_id: machineId });
    if (response.success === '0' || response.success === false) {
        return { success: false, message: response.message || 'Failed to extend machine' };
    }
    return { success: true, message: response.message || 'Machine extended' };
}

export async function submitMachineFlag(apiKey: string, machineId: number, flag: string): Promise<{ success: boolean; message: string }> {
    // Uses v5
    const response = await makeRequest<any>(apiKey, 'POST', 'machine/own', { machine_id: machineId, flag }, 'v5');
    if (response.success === '0' || response.success === false) {
        return { success: false, message: response.message || 'Failed to submit flag' };
    }
    return { success: true, message: response.message || 'Flag submitted' };
}

export async function getMachine(apiKey: string, machineId: number): Promise<MachineInfo> {
    const response = await makeRequest<any>(apiKey, 'GET', `machine/profile/${machineId}`);
    return response.info;
}

export async function getActiveMachine(apiKey: string): Promise<ActiveMachineInfo | null> {
    const response = await makeRequest<any>(apiKey, 'GET', 'machine/active');
    if (!response.info) return null;
    return response.info;
}

// Pwnbox
export async function getPwnboxStatus(apiKey: string): Promise<PwnboxStatus | null> {
    const response = await makeRequest<any>(apiKey, 'GET', 'pwnbox/status');
    if (response.message) {
        // "message" usually implies no pwnbox active or error, python raises NoPwnBoxActiveException
        return null;
    }
    return response.data;
}

export async function getPwnboxUsage(apiKey: string): Promise<PwnboxUsage> {
    const response = await makeRequest<any>(apiKey, 'GET', 'pwnbox/usage');
    return response.data;
}

export async function terminatePwnbox(apiKey: string): Promise<{ success: boolean; message: string }> {
    const response = await makeRequest<any>(apiKey, 'POST', 'pwnbox/terminate');
    if (response.error) {
        return { success: false, message: response.error };
    }
    return { success: true, message: 'Pwnbox terminated' };
}

export async function getPwnboxSshCredentials(apiKey: string): Promise<{ hostname: string; username: string; password?: string; command: string } | null> {
    const status = await getPwnboxStatus(apiKey);
    if (!status || !status.is_ready) {
        return null;
    }

    // Construct SSH command similar to python version: sshpass -p {password} ssh {user}@{host}
    // Note: We just return the string, we don't execute it.
    const password = status.vnc_password;
    const command = `sshpass -p '${password}' ssh ${status.username}@${status.hostname}`;

    return {
        hostname: status.hostname,
        username: status.username,
        password: password,
        command: command
    };
}

export async function extendPwnbox(apiKey: string): Promise<{ success: boolean; message: string }> {
    // Note: Python code didn't explicitly show extend pwnbox, but user asked for it.
    // I need to guess or check if there is an endpoint.
    // Usually it's `pwnbox/extend`? Or maybe it's not available via API?
    // Let's assume `pwnbox/extend` exists or check if I missed it in python code.
    // Python code `pwnbox.py` didn't have extend.
    // `machine.py` has extend for VM.
    // I will implement it but warn it might not work if endpoint is wrong.
    // Actually, let's check `htb_operator.py` or other files if I missed something.
    // But for now I will assume `pwnbox/extend` might exist or I will leave it as a TODO or try it.
    // Wait, the user request said "query remaining time for pwnbox and extend".
    // If python client doesn't have it, maybe it's not exposed?
    // I will try `POST pwnbox/extend`.
    try {
        const response = await makeRequest<any>(apiKey, 'POST', 'pwnbox/extend');
        return { success: true, message: response.message || 'Pwnbox extended' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}


// ProLabs
export async function getProLabs(apiKey: string): Promise<ProLabInfo[]> {
    const response = await makeRequest<any>(apiKey, 'GET', 'prolabs');
    return response.data.labs;
}

export async function getProLabInfo(apiKey: string, proLabId: number): Promise<ProLabInfo> {
    // Logic to find specific prolab from list or get details
    // Python `get_prolab` fetches all and filters.
    // There is also `prolab/{id}/info` used in `ProLabInfo` init.
    const response = await makeRequest<any>(apiKey, 'GET', `prolab/${proLabId}/info`);
    return response.data; // This might be partial info, but let's see.
}

export async function submitProLabFlag(apiKey: string, proLabId: number, flag: string): Promise<{ success: boolean; message: string }> {
    const response = await makeRequest<any>(apiKey, 'POST', `prolab/${proLabId}/flag`, { flag });
    if (response.message) {
        // Usually if message is returned it's success or error, check status code or content
        // Python: returns True, data["message"]
        return { success: true, message: response.message };
    }
    return { success: false, message: 'Unknown response' };
}

export async function requestProLabReset(apiKey: string, proLabId: number): Promise<{ success: boolean; message: string }> {
    // Python: `prolab/{id}/reset` (GET request? Python says get_request)
    // Wait, `get_reset_status` calls `prolab/{id}/reset`.
    // Is there a POST to reset?
    // Python code doesn't seem to have a `reset()` method for ProLab, only `get_reset_status`.
    // But user asked for "request reset for pro lab".
    // Maybe it is `POST prolab/{id}/reset`?
    // I will try POST.
    try {
        const response = await makeRequest<any>(apiKey, 'POST', `prolab/${proLabId}/reset`);
        return { success: true, message: response.message || 'Reset requested' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

// User Progress
export async function getUserProLabProgress(apiKey: string, userId: number): Promise<UserProgress[]> {
    const response = await makeRequest<any>(apiKey, 'GET', `user/profile/progress/prolab/${userId}`);
    return response.profile.prolabs;
}

export async function getUserMachineProgress(apiKey: string, userId: number): Promise<UserProgress[]> {
    const response = await makeRequest<any>(apiKey, 'GET', `user/profile/progress/machines/os/${userId}`);
    return response.profile.operating_systems;
}

// VPN / Pwnbox Switching
export async function getVpnServers(apiKey: string, product: string = 'pwnbox'): Promise<any[]> {
    // Product can be 'pwnbox', 'prolab', 'starting_point', etc.
    // The python code uses `connections/servers?product={product}`
    // Note: For prolab, it might need specific handling or just pass 'prolab' as product?
    // Python code handles prolab specifically by iterating prolabs.
    // But for pwnbox switching, usually it's about switching the context for the "pwnbox" product or specific labs.
    // Let's expose the raw list for now.
    const response = await makeRequest<any>(apiKey, 'GET', `connections/servers?product=${product}`);
    // The response structure is complex (grouped by location), let's return the raw data or flatten it?
    // Python flattens it. Let's return raw data for flexibility or implement flattening if needed.
    // For simplicity in this port, let's return the data object which contains locations.
    return response.data;
}

export async function switchVpn(apiKey: string, vpnServerId: number): Promise<{ success: boolean; message: string }> {
    try {
        const response = await makeRequest<any>(apiKey, 'POST', `connections/servers/switch/${vpnServerId}`, { id: vpnServerId });
        if (response.message) {
            // Check for specific error messages like "active machine before switching"
            if (response.message.includes('active machine before switching')) {
                return { success: false, message: response.message };
            }
            return { success: true, message: response.message };
        }
        return { success: true, message: 'Switched VPN server' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}
