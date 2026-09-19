import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

old_gps = """        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        const address = data.address;
        const loc = `${address.village || address.town || address.city || ''}, ${address.state_district || ''}, ${address.state || ''}`.replace(/^, /, '').replace(/, $/, '');
        handleSendAction(loc);"""

new_gps = """        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
          headers: {
            'Accept-Language': 'en-US,en' // Force English results
          }
        });
        const data = await res.json();
        
        let loc = "";
        if (data.address) {
          const { village, town, city, suburb, county, state_district, state } = data.address;
          const localArea = village || town || city || suburb || county || '';
          const dist = state_district || '';
          const st = state || '';
          loc = [localArea, dist, st].filter(Boolean).join(', ');
        } else if (data.display_name) {
          // Fallback to display name if address object is weird
          const parts = data.display_name.split(', ');
          loc = parts.length >= 3 ? `${parts[0]}, ${parts[parts.length-2]}, ${parts[parts.length-1]}` : data.display_name;
        } else {
          loc = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        }
        
        handleSendAction(loc);"""

content = content.replace(old_gps, new_gps)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
