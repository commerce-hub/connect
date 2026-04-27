FROM fmk-prod.nexus-ci.onefiserv.net/fmk/node/node20:FMK-25-12-01

WORKDIR /app

# Install express
RUN npm init -y && npm install express@4

# Copy server
COPY server.js .

# Copy SDK artifacts
COPY projects/commerce-hub-connect-web-sdk/dist/ ./public/sdk/

ENV PORT=3007
EXPOSE 3007

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3007/health', r => { process.exit(r.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

CMD ["node", "server.js"]

