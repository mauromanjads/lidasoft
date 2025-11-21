import bcrypt

password = bcrypt.hashpw("lida1983".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
print(password)
