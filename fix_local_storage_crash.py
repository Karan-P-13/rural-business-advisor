import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Fix the useEffect that loads from localStorage to deduplicate keys
old_load = """  // Load History on Mount
  useEffect(() => {
    const saved = localStorage.getItem('unnati_sessions');
    if (saved) setSessions(JSON.parse(saved));"""

new_load = """  // Load History on Mount
  useEffect(() => {
    const saved = localStorage.getItem('unnati_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // FIX: Purge any corrupted duplicate IDs that were saved in the user's browser before the Strict Mode fix!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const uniqueSessions = parsed.filter((v: any, i: number, a: any[]) => a.findIndex(t => (t.id === v.id)) === i);
        setSessions(uniqueSessions);
        if (parsed.length !== uniqueSessions.length) {
          localStorage.setItem('unnati_sessions', JSON.stringify(uniqueSessions));
        }
      } catch(e) {
        console.error(e);
      }
    }"""
    
content = content.replace(old_load, new_load)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
