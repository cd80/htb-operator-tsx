import {
    getConnectionStatus,
    getMachine,
    spawnMachine,
    terminateMachine,
    getPwnboxStatus,
    getProLabs,
    submitMachineFlag
} from '../src';

const API_KEY = process.env.HTB_API_KEY || 'fake-api-key';

async function main() {
    try {
        console.log('Checking connection status...');
        const status = await getConnectionStatus(API_KEY);
        console.log('Connection Status:', status);

        console.log('Getting Pwnbox status...');
        const pwnbox = await getPwnboxStatus(API_KEY);
        if (pwnbox) {
            console.log('Pwnbox is active:', pwnbox.hostname);
        } else {
            console.log('No active Pwnbox');
        }

        // Example: Get machine info for ID 1
        const machineId = 1;
        console.log(`Getting info for machine ${machineId}...`);
        const machine = await getMachine(API_KEY, machineId);
        console.log('Machine:', machine.name);

        // Example: Spawn machine (commented out to avoid accidental spawn if key was real)
        // console.log('Spawning machine...');
        // const spawnResult = await spawnMachine(API_KEY, machineId);
        // console.log('Spawn result:', spawnResult);

    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

main();
