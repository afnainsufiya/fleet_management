'use client';

import { useEffect, useState } from 'react';

import { getVehicles } from '../api/vehicle.api';
import { getDrivers } from '../api/driver.api';

// Shared hook to load vehicles + drivers for use in dropdowns
// across Trips, Fuel, Maintenance, Expenses and Assignments pages.
export default function useLookups() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [vehicleRes, driverRes] = await Promise.all([
          getVehicles(),
          getDrivers(),
        ]);

        setVehicles(vehicleRes.data || []);
        setDrivers(driverRes.data || []);
      } catch (error) {
        console.error('Failed to load lookups:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLookups();
  }, []);

  return { vehicles, drivers, lookupsLoading: loading };
}
