export interface ConnectionStatus {
    status: string;
    // Add more fields as discovered
}

export interface MachineInfo {
    id: number;
    name: string;
    os: string;
    active: boolean;
    retired: boolean;
    points: number;
    static_points: number;
    release_date: string;
    user_owns_count: number;
    root_owns_count: number;
    free: boolean;
    stars: number;
    difficultyText: string;
    ip?: string;
    // Add other relevant fields from python MachineInfo
}

export interface ActiveMachineInfo {
    id: number;
    name: string;
    ip: string;
    expires_at: string;
    isSpawning: boolean;
    lab_server: string;
    type: string;
    vpn_server_id?: number;
}

export interface ProLabInfo {
    id: number;
    name: string;
    release_date: string;
    machines_count: number;
    flags_count: number;
    ownership: number;
    level: number;
    lab_servers_count: number;
    // Add other relevant fields
}

export interface PwnboxStatus {
    id: number;
    flock_id: number;
    hostname: string;
    username: string;
    status: string;
    is_ready: boolean;
    location: string;
    life_remaining: number;
    expires_at: string;
}

export interface PwnboxUsage {
    minutes: number;
    sessions: number;
    allowed_minutes: number;
    remaining_minutes: number;
    used: number;
    total: number;
    active_minutes: number;
}

export interface UserProgress {
    // Define based on requirements
    // ProLab progress, Machine progress
    name: string;
    completion_percentage: number;
    owned_flags: number;
    total_flags: number;
}

export interface ApiResponse<T> {
    message?: string;
    data?: T;
    info?: T; // Sometimes data is in 'info'
    success?: string | boolean; // Sometimes '0' or '1' or true/false
}

export interface VpnServer {
    id: number;
    friendly_name: string;
    current_clients: number;
    is_dedicated: boolean;
    is_assigned: boolean;
    location: string;
    // Add other fields as needed
}
