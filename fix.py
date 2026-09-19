with open("src/app/page.tsx", "r") as f:
    text = f.read()

# find {Boolean(msg.sender === 'bot' && index === messages.length - 1 && !isLoading) \&\& (
text = text.replace("{Boolean(msg.sender === 'bot' && index === messages.length - 1 && !isLoading) \\&\\& (", "{msg.sender === 'bot' && index === messages.length - 1 && !isLoading ? (")

# I need to find the matching closing bracket for this ternary
# Actually, wait. I will just rewrite the page.tsx using write_to_file.
