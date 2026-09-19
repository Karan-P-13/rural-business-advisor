import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

old_fetch_location = """  const fetchLocation = () => {
    setIsLocating(true);
    
    // HACKATHON DEMO MAGIC: If the phone blocks real GPS, we fake a realistic 1.5s delay 
    // and automatically insert a location so the demo video looks flawless.
    const runMovieMagicFallback = () => {
      setTimeout(() => {
        handleSendAction("Chennai, Karapakkam");
        setIsLocating(false);
      }, 1500);
    };

    if (!navigator.geolocation) {
      runMovieMagicFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        const address = data.address;
        const loc = `${address.village || address.town || address.city || ''}, ${address.state_district || ''}, ${address.state || ''}`.replace(/^, /, '').replace(/, $/, '');
        handleSendAction(loc);
        setIsLocating(false);
      } catch (e) {
        runMovieMagicFallback();
      }
    }, (error) => {
      // Intercept the browser denial and silently run the magic fallback instead of an alert!
      runMovieMagicFallback();
    });
  };"""

original_fetch_location = """  const fetchLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        const address = data.address;
        const loc = `${address.village || address.town || address.city || ''}, ${address.state_district || ''}, ${address.state || ''}`.replace(/^, /, '').replace(/, $/, '');
        handleSendAction(loc);
      } catch (e) {
        alert("Failed to get address. Please type it.");
      }
      setIsLocating(false);
    }, () => {
      alert("Location access denied. Please ensure you are on a secure (HTTPS) connection or localhost.");
      setIsLocating(false);
    });
  };"""

content = content.replace(old_fetch_location, original_fetch_location)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
