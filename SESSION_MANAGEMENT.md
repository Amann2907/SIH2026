# MediKiosk Session Management

## Overview
MediKiosk implements comprehensive session management to ensure each patient starts with a clean slate and no data leakage between patients.

## Session Reset Triggers

### 1. **Home Page - Start Intake Button**
- **Location**: `/` (Home.tsx)
- **Trigger**: User clicks "शुरू करें / START INTAKE" button
- **Action**: Calls `startNewSession()` before navigation
- **What Gets Reset**: All clinical data, documents, voice transcripts, red flags
- **What Persists**: Language preference (for convenience)

### 2. **Success Page - New Patient Button**
- **Location**: `/intake/success` (IntakeSuccess.tsx)
- **Trigger**: User clicks "नया मरीज / Start New Patient Intake" button after completing an intake
- **Action**: Calls `startNewSession()` and navigates to home
- **Use Case**: Staff wants to immediately start another patient without going through home page

## Session Management Functions

### `startNewSession()`
```typescript
const startNewSession = () => {
  const newState = {
    ...defaultState,
    language: state.language, // Preserve language preference
    sessionStarted: new Date().toISOString(),
  };
  setState(newState);
  localStorage.setItem('medikiosk_intake_state', JSON.stringify(newState));
};
```

**Resets to Default:**
- ✅ Patient information (name, age, gender, ID, ABHA)
- ✅ Voice data (chief complaint, pain severity, symptoms)
- ✅ Clinical questions and answers
- ✅ Red flags
- ✅ Uploaded documents and OCR results
- ✅ Encounter ID
- ✅ Summary confirmation status

**Preserves:**
- ✅ Language preference (user convenience)
- ✅ New session timestamp

### `resetIntake()`
```typescript
const resetIntake = () => {
  const newState = { ...defaultState, sessionStarted: null };
  setState(newState);
  localStorage.removeItem('medikiosk_intake_state');
};
```

**Complete Reset:**
- Removes ALL data including language preference
- Clears localStorage completely
- Use case: Complete system reset

## Data Persistence

### LocalStorage Key
- **Key**: `medikiosk_intake_state`
- **Storage**: Browser localStorage
- **Automatic Sync**: Updates on every state change
- **Manual Clear**: Triggered by `resetIntake()` or `startNewSession()`

### Session Timestamps
- `sessionStarted`: ISO 8601 timestamp when intake began
- Used for: Session duration tracking, timeout detection, audit logs

## Patient Data Flow

### New Patient Workflow
```
1. User lands on Home page
2. Clicks "START INTAKE" → startNewSession() called
3. Navigates to Language Selection
4. Selects language → persisted for this session
5. Completes intake steps
6. Submits to doctor
7. Success page appears
8. Clicks "New Patient" → startNewSession() called again
9. Returns to Home page with clean slate
```

### Data Lifecycle
```
Empty State → Patient Entry → Voice Intake → Document Upload → Summary → Submission → Reset
     ↓              ↓              ↓               ↓              ↓           ↓          ↓
  Default      Collecting     Recording      Processing      Reviewing   Submitted   Empty
```

## Security & Privacy

### Data Isolation
- ✅ Each session is completely isolated
- ✅ No data from previous patients is accessible
- ✅ LocalStorage is cleared between sessions
- ✅ No hardcoded patient data remains in production

### HIPAA/ABDM Compliance Considerations
- Session resets prevent data leakage
- Automatic timeout can be implemented (add useEffect with timer)
- All PHI is cleared on session reset
- Submitted encounters are stored server-side, not in browser

## Future Enhancements

### Recommended Features
1. **Auto-timeout**: Reset session after 15 minutes of inactivity
2. **Session expiry warning**: Show countdown before auto-reset
3. **Staff authentication**: Require staff PIN to start new session
4. **Encounter archival**: Move completed encounters to secure database
5. **Session analytics**: Track average intake duration, abandonment rate
6. **Multi-kiosk sync**: Prevent duplicate submissions across kiosks

### Implementation Example (Auto-timeout)
```typescript
useEffect(() => {
  let inactivityTimer: NodeJS.Timeout;
  
  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      // Auto-reset after 15 minutes
      startNewSession();
      navigate('/');
    }, 15 * 60 * 1000);
  };
  
  // Listen for user activity
  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('keypress', resetTimer);
  window.addEventListener('touchstart', resetTimer);
  
  resetTimer();
  
  return () => {
    clearTimeout(inactivityTimer);
    window.removeEventListener('mousemove', resetTimer);
    window.removeEventListener('keypress', resetTimer);
    window.removeEventListener('touchstart', resetTimer);
  };
}, []);
```

## Testing Checklist

- [ ] Start intake from home page → verify empty state
- [ ] Complete full intake → submit → verify persistence
- [ ] Click "New Patient" on success page → verify clean slate
- [ ] Navigate back from language selection → verify state preserved
- [ ] Refresh browser mid-intake → verify state recovered from localStorage
- [ ] Complete intake → refresh on success page → verify encounter ID persists
- [ ] Start new patient → verify previous patient data is gone
- [ ] Check localStorage in DevTools → verify key is correct
- [ ] Test with multiple rapid resets → verify no race conditions
- [ ] Test language persistence across resets → verify preserved

## Troubleshooting

### Issue: Previous patient data showing
**Cause**: `startNewSession()` not called on entry point
**Fix**: Ensure Home page calls `startNewSession()` on button click

### Issue: Language resets every time
**Cause**: Using `resetIntake()` instead of `startNewSession()`
**Fix**: Use `startNewSession()` to preserve language

### Issue: localStorage not clearing
**Cause**: Multiple tabs/windows interfering
**Fix**: Use `localStorage.clear()` for complete reset or close other tabs

### Issue: State not persisting after refresh
**Cause**: localStorage quota exceeded or disabled
**Fix**: Check browser settings, reduce state size, implement fallback
