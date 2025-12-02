# htb-operator-ts

A TypeScript client for the Hack The Box API.
This is a port of the [htb-operator](https://github.com/cd80/htb-operator) Python library, designed to be used in TypeScript/JavaScript projects.

## Installation

You can install this package directly from GitHub:

```bash
npm install git+https://github.com/cd80/htb-operator-tsx
```

## Key Differences from Python Version

**Important**: Unlike the original Python version which might rely on a system-wide configuration or a single initialization step, this TypeScript version requires you to pass your **API Key** to every function call. This ensures that the library can be used in stateless environments (like serverless functions) or with multiple user accounts simultaneously without global state issues.

## Usage

Import the functions you need from the package.

```typescript
import { 
  getConnectionStatus, 
  getMachine, 
  spawnMachine, 
  terminateMachine, 
  submitMachineFlag,
  getPwnboxStatus,
  getProLabs
} from 'htb-operator-ts';

const API_KEY = 'YOUR_HTB_API_KEY';
```

### Connection Status

Check the status of your VPN connection.

```typescript
const status = await getConnectionStatus(API_KEY);
console.log(status);
```

### Machines

**Get Machine Info**
```typescript
const machineId = 1; // ID of the machine
const machine = await getMachine(API_KEY, machineId);
console.log(`Machine: ${machine.name}, OS: ${machine.os}`);
```

**Spawn Machine**
```typescript
const spawnResult = await spawnMachine(API_KEY, machineId);
if (spawnResult.success) {
  console.log('Machine spawning...');
} else {
  console.error('Failed to spawn:', spawnResult.message);
}
```

**Terminate Machine**
```typescript
await terminateMachine(API_KEY, machineId);
```

**Reset Machine**
```typescript
await resetMachine(API_KEY, machineId);
```

**Extend Machine**
```typescript
await extendMachine(API_KEY, machineId);
```

**Submit Flag**
```typescript
const flag = 'HTB{...}';
const submission = await submitMachineFlag(API_KEY, machineId, flag);
console.log(submission.message);
```

### Pwnbox

**Get Status**
```typescript
const pwnbox = await getPwnboxStatus(API_KEY);
if (pwnbox) {
  console.log(`Pwnbox active at ${pwnbox.hostname}`);
} else {
  console.log('No active Pwnbox');
}
```

**Get Usage**
```typescript
const usage = await getPwnboxUsage(API_KEY);
console.log(`Remaining minutes: ${usage.remaining_minutes}`);
```

**Terminate Pwnbox**
```typescript
await terminatePwnbox(API_KEY);
```

**Extend Pwnbox**
```typescript
await extendPwnbox(API_KEY);
```

**Get SSH Credentials**
```typescript
const ssh = await getPwnboxSshCredentials(API_KEY);
if (ssh) {
  console.log(`SSH Command: ${ssh.command}`);
  console.log(`Password: ${ssh.password}`);
} else {
  console.log('Pwnbox not ready');
}
```

### ProLabs

**List ProLabs**
```typescript
const prolabs = await getProLabs(API_KEY);
prolabs.forEach(lab => console.log(lab.name));
```

**Get ProLab Info**
```typescript
const proLabId = 1;
const labInfo = await getProLabInfo(API_KEY, proLabId);
console.log(labInfo);
```

**Submit ProLab Flag**
```typescript
await submitProLabFlag(API_KEY, proLabId, 'HTB{...}');
```

### VPN / Pwnbox Switching

**List VPN Servers**
```typescript
// Get servers for Pwnbox
const servers = await getVpnServers(API_KEY, 'pwnbox');
console.log(servers);
```

**Switch VPN Server**
```typescript
const serverId = 123; // ID from getVpnServers
const switchResult = await switchVpn(API_KEY, serverId);
if (switchResult.success) {
  console.log('Switched VPN server');
} else {
  console.error('Failed to switch:', switchResult.message);
}
```

### User Progress

**Get Machine Progress**
```typescript
const userId = 12345;
const progress = await getUserMachineProgress(API_KEY, userId);
console.log(progress);
```
