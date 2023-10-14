FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /backend

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn của ứng dụng vào thư mục làm việc
COPY . .

# Mở cổng mạng
EXPOSE 3001

# Chạy ứng dụng NestJS
CMD [ "npm", "run", "start:dev" ]