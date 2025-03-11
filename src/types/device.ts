export type DeviceData = {
    temperature: {
      sensor1: number;
      sensor2: number;
    };
    ldr: {
      raw_value: number;
      voltage: number;
      intensity: string;
    };
    current: {
      power_produced_ma: number;
      battery_storage_ma: number;
      power_consumed_ma: number;
      device_consumption_ma: number;
    };
    voltage: {
      power_produced_mv: number;
      battery_storage_mv: number;
      power_consumed_mv: number;
      device_consumption_mv: number;
    };
    power: {
      power_produced: number;
      battery_storage: number;
      power_consumed: number;
      device_consumption: number;
    };
    generated_power: {
      power_produced: number;
      battery_storage: number;
      power_consumed: number;
      device_consumption: number;
    };
    pzem: {
      voltage: number;
      current: number;
      power: number;
      energy: number;
      frequency: number;
      power_factor: number;
    };
    country_code: string;
    wallet_address: string;
    device_id: string;
    hash: string;
  };
  