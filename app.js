// Fuel Consumption Tracker Application
// Main application logic for tracking and managing fuel consumption data

class FuelConsumptionTracker {
  constructor() {
    this.fuelRecords = [];
    this.vehicles = [];
    this.loadFromStorage();
  }

  /**
   * Add a new vehicle to the tracker
   * @param {string} vehicleId - Unique identifier for the vehicle
   * @param {string} name - Vehicle name/model
   * @param {string} fuelType - Type of fuel (petrol, diesel, electric, hybrid)
   * @returns {object} The created vehicle object
   */
  addVehicle(vehicleId, name, fuelType = 'petrol') {
    const vehicle = {
      id: vehicleId,
      name: name,
      fuelType: fuelType,
      createdAt: new Date().toISOString(),
      totalDistance: 0,
      totalFuelConsumed: 0
    };
    this.vehicles.push(vehicle);
    this.saveToStorage();
    return vehicle;
  }

  /**
   * Record a fuel consumption entry
   * @param {string} vehicleId - ID of the vehicle
   * @param {number} fuelAmount - Amount of fuel consumed (in liters)
   * @param {number} distance - Distance traveled (in kilometers)
   * @param {string} date - Date of the record (ISO string)
   * @param {string} notes - Additional notes
   * @returns {object} The created record object
   */
  recordFuelConsumption(vehicleId, fuelAmount, distance, date = null, notes = '') {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${vehicleId} not found`);
    }

    const record = {
      id: this.generateId(),
      vehicleId: vehicleId,
      fuelAmount: parseFloat(fuelAmount),
      distance: parseFloat(distance),
      consumption: parseFloat((distance / fuelAmount).toFixed(2)), // km/liter
      date: date || new Date().toISOString(),
      notes: notes,
      createdAt: new Date().toISOString()
    };

    this.fuelRecords.push(record);
    
    // Update vehicle statistics
    vehicle.totalDistance += record.distance;
    vehicle.totalFuelConsumed += record.fuelAmount;

    this.saveToStorage();
    return record;
  }

  /**
   * Get all records for a specific vehicle
   * @param {string} vehicleId - ID of the vehicle
   * @returns {array} Array of fuel records for the vehicle
   */
  getVehicleRecords(vehicleId) {
    return this.fuelRecords.filter(record => record.vehicleId === vehicleId);
  }

  /**
   * Calculate average fuel consumption for a vehicle
   * @param {string} vehicleId - ID of the vehicle
   * @returns {number} Average consumption in km/liter
   */
  getAverageConsumption(vehicleId) {
    const records = this.getVehicleRecords(vehicleId);
    if (records.length === 0) return 0;

    const totalKm = records.reduce((sum, r) => sum + r.distance, 0);
    const totalLiters = records.reduce((sum, r) => sum + r.fuelAmount, 0);

    return totalLiters > 0 ? parseFloat((totalKm / totalLiters).toFixed(2)) : 0;
  }

  /**
   * Get consumption statistics for a vehicle
   * @param {string} vehicleId - ID of the vehicle
   * @returns {object} Statistics object
   */
  getConsumptionStats(vehicleId) {
    const records = this.getVehicleRecords(vehicleId);
    if (records.length === 0) {
      return {
        count: 0,
        totalDistance: 0,
        totalFuel: 0,
        averageConsumption: 0,
        minConsumption: 0,
        maxConsumption: 0
      };
    }

    const consumptions = records.map(r => r.consumption);
    const totalDistance = records.reduce((sum, r) => sum + r.distance, 0);
    const totalFuel = records.reduce((sum, r) => sum + r.fuelAmount, 0);

    return {
      count: records.length,
      totalDistance: parseFloat(totalDistance.toFixed(2)),
      totalFuel: parseFloat(totalFuel.toFixed(2)),
      averageConsumption: parseFloat((totalDistance / totalFuel).toFixed(2)),
      minConsumption: Math.min(...consumptions),
      maxConsumption: Math.max(...consumptions)
    };
  }

  /**
   * Get records within a date range
   * @param {string} vehicleId - ID of the vehicle
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {array} Filtered records
   */
  getRecordsByDateRange(vehicleId, startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return this.getVehicleRecords(vehicleId).filter(record => {
      const recordTime = new Date(record.date).getTime();
      return recordTime >= start && recordTime <= end;
    });
  }

  /**
   * Update an existing fuel record
   * @param {string} recordId - ID of the record to update
   * @param {object} updates - Object with fields to update
   * @returns {object} Updated record
   */
  updateRecord(recordId, updates) {
    const recordIndex = this.fuelRecords.findIndex(r => r.id === recordId);
    if (recordIndex === -1) {
      throw new Error(`Record with ID ${recordId} not found`);
    }

    const record = this.fuelRecords[recordIndex];
    const oldRecord = { ...record };

    // Update record fields
    if (updates.fuelAmount !== undefined) {
      record.fuelAmount = parseFloat(updates.fuelAmount);
    }
    if (updates.distance !== undefined) {
      record.distance = parseFloat(updates.distance);
    }
    if (updates.date !== undefined) {
      record.date = updates.date;
    }
    if (updates.notes !== undefined) {
      record.notes = updates.notes;
    }

    // Recalculate consumption
    if (record.distance > 0 && record.fuelAmount > 0) {
      record.consumption = parseFloat((record.distance / record.fuelAmount).toFixed(2));
    }

    // Update vehicle statistics
    const vehicle = this.vehicles.find(v => v.id === record.vehicleId);
    if (vehicle) {
      vehicle.totalDistance -= oldRecord.distance;
      vehicle.totalDistance += record.distance;
      vehicle.totalFuelConsumed -= oldRecord.fuelAmount;
      vehicle.totalFuelConsumed += record.fuelAmount;
    }

    this.saveToStorage();
    return record;
  }

  /**
   * Delete a fuel record
   * @param {string} recordId - ID of the record to delete
   * @returns {boolean} True if deleted successfully
   */
  deleteRecord(recordId) {
    const recordIndex = this.fuelRecords.findIndex(r => r.id === recordId);
    if (recordIndex === -1) {
      throw new Error(`Record with ID ${recordId} not found`);
    }

    const record = this.fuelRecords[recordIndex];
    
    // Update vehicle statistics
    const vehicle = this.vehicles.find(v => v.id === record.vehicleId);
    if (vehicle) {
      vehicle.totalDistance -= record.distance;
      vehicle.totalFuelConsumed -= record.fuelAmount;
    }

    this.fuelRecords.splice(recordIndex, 1);
    this.saveToStorage();
    return true;
  }

  /**
   * Get all vehicles
   * @returns {array} Array of all vehicles
   */
  getAllVehicles() {
    return this.vehicles;
  }

  /**
   * Get a specific vehicle by ID
   * @param {string} vehicleId - ID of the vehicle
   * @returns {object} Vehicle object
   */
  getVehicle(vehicleId) {
    return this.vehicles.find(v => v.id === vehicleId);
  }

  /**
   * Delete a vehicle and its records
   * @param {string} vehicleId - ID of the vehicle to delete
   * @returns {boolean} True if deleted successfully
   */
  deleteVehicle(vehicleId) {
    const vehicleIndex = this.vehicles.findIndex(v => v.id === vehicleId);
    if (vehicleIndex === -1) {
      throw new Error(`Vehicle with ID ${vehicleId} not found`);
    }

    // Remove all records for this vehicle
    this.fuelRecords = this.fuelRecords.filter(r => r.vehicleId !== vehicleId);
    this.vehicles.splice(vehicleIndex, 1);
    this.saveToStorage();
    return true;
  }

  /**
   * Export data as JSON
   * @returns {string} JSON string of all data
   */
  exportData() {
    return JSON.stringify({
      vehicles: this.vehicles,
      records: this.fuelRecords,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  /**
   * Import data from JSON
   * @param {string} jsonData - JSON string to import
   * @returns {object} Imported data
   */
  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      if (data.vehicles) this.vehicles = data.vehicles;
      if (data.records) this.fuelRecords = data.records;
      this.saveToStorage();
      return data;
    } catch (error) {
      throw new Error('Invalid JSON format for import');
    }
  }

  /**
   * Generate a unique ID
   * @returns {string} Unique identifier
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Save data to localStorage
   */
  saveToStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('fuelTrackerVehicles', JSON.stringify(this.vehicles));
      localStorage.setItem('fuelTrackerRecords', JSON.stringify(this.fuelRecords));
    }
  }

  /**
   * Load data from localStorage
   */
  loadFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const vehicles = localStorage.getItem('fuelTrackerVehicles');
      const records = localStorage.getItem('fuelTrackerRecords');
      
      if (vehicles) this.vehicles = JSON.parse(vehicles);
      if (records) this.fuelRecords = JSON.parse(records);
    }
  }

  /**
   * Clear all data
   */
  clearAllData() {
    this.vehicles = [];
    this.fuelRecords = [];
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('fuelTrackerVehicles');
      localStorage.removeItem('fuelTrackerRecords');
    }
  }
}

// Export for use in Node.js/CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FuelConsumptionTracker;
}

// Create a global instance if in browser environment
if (typeof window !== 'undefined') {
  window.FuelTracker = new FuelConsumptionTracker();
}
