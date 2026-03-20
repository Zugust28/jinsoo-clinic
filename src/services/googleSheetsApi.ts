const API_URL = 'https://script.google.com/macros/s/AKfycbxGQuRrsF89A2nWhIqflRIw7UTg9VnERUWHEy9sefmAUhrKvtHfjtNcxl7WFRx2Rx46jQ/exec';

export interface GoogleSheetCustomer {
  hn?: string;
  name: string;
  phone: string;
  visitCount?: number;
  lastVisit?: string;
  nickname?: string;
  birthday?: string;
  age?: number;
  source?: string;
  caretaker?: string;
  province?: string;
  district?: string;
  lineUid?: string;
  registeredDate?: string;
}

export async function fetchCustomers(): Promise<{ success: boolean; customers?: GoogleSheetCustomer[]; error?: string }> {
  try {
    const response = await fetch(`${API_URL}?action=getCustomers`, {
      method: 'GET',
      redirect: 'follow',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function syncFromExternalSheet(sheetId: string): Promise<{ success: boolean; customers?: GoogleSheetCustomer[]; error?: string }> {
  try {
    const response = await fetch(`${API_URL}?action=syncFromExternalSheet&sheetId=${encodeURIComponent(sheetId)}`, {
      method: 'GET',
      redirect: 'follow',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error syncing from external sheet:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function createAppointment(appointment: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'createAppointment',
        ...appointment,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
