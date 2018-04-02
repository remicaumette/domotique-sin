#include <Redis.h>

#define WIFI_SSID "SSID"
#define WIFI_PASSWORD "PASSWORD"

#define REDIS_ADDR "127.0.0.1"
#define REDIS_PORT 6379
#define REDIS_PASSWORD ""

#define PIR_PIN         14
#define LIGHT_PIN       A0

Redis redis(REDIS_ADDR, REDIS_PORT);

void setup()
{
    Serial.begin(115200);
    Serial.println();

    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to the WiFi");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(250);
        Serial.print(".");
    }
    Serial.println();
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    if (redis.begin(REDIS_PASSWORD))
    {
        Serial.println("Connected to the Redis server!");
    }
    else
    {
        Serial.println("Failed to connect to the Redis server!");
    }

    pinMode(PIR_PIN, INPUT);
    pinMode(LIGHT_PIN, INPUT);
}

void loop()
{
    String message = "{\"sensor\": \"LUMINOSITY\", \"value\": ";
    message.concat(analogRead(LIGHT_PIN));
    message.concat("}");
    if (redis.publish("sensors", message.c_str()) == -1)
    {
      Serial.println("Failed to send the luminosity over redis pub/sub!");
    }
    message = "{\"sensor\": \"PRESENCE\", \"value\": ";
    message.concat(digitalRead(PIR_PIN) ? "true" : "false");
    message.concat("}");
    if (redis.publish("sensors", message.c_str()) == -1)
    {
        Serial.println("Failed to send the presence over redis pub/sub!");
    }
}
