with open("src/app/api/vision/route.ts", "r") as f:
    v = f.read()
v = v.replace('});\n    }', '}')
with open("src/app/api/vision/route.ts", "w") as f:
    f.write(v)
