import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

old_fetch = """  const fetchLocation = () => {
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

new_fetch = """  const fetchLocation = () => {
    setIsLocating(true);

    // Fallback function: Use IP-based location if true GPS is blocked by HTTP on mobile
    const fallbackToIPLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.city && data.region) {
          handleSendAction(`${data.city}, ${data.region}`);
        } else {
          alert("Failed to detect location. Please type it.");
        }
      } catch (err) {
        alert("Failed to detect location. Please type it manually.");
      }
      setIsLocating(false);
    };

    if (!navigator.geolocation) {
      fallbackToIPLocation();
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
        fallbackToIPLocation();
      }
    }, () => {
      // If the browser blocks GPS (e.g., because of HTTP on mobile), gracefully fallback to IP location
      fallbackToIPLocation();
    });
  };"""

content = content.replace(old_fetch, new_fetch)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
