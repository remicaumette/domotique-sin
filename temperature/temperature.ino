#include <Redis.h>
#include <DHT.h>

#define WIFI_SSID "Domotique SIN"
#define WIFI_PASSWORD "12345678"

#define REDIS_ADDR "192.168.1.1"
#define REDIS_PORT 6379
#define REDIS_PASSWORD ""

#define DHT_PIN   2
#define DHT_TYPE  DHT22

Redis redis(REDIS_ADDR, REDIS_PORT);
DHT dht(DHT_PIN, DHT_TYPE);

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

    dht.begin();
}

void loop()
{
    delay(60000);
    float temperature = dht.readTemperature(false);
    if (isnan(temperature)) 
    {
        Serial.println("Failed to read the temperature!");
    } 
    else
    {
        String message = "{\"sensor\": \"TEMPERATURE\", \"value\": ";
        message.concat(temperature);
        message.concat("}");
        if (redis.publish("sensors", message.c_str()) == -1)
        {
            Serial.println("Failed to send the temperature over redis pub/sub!");
        }
    }
    float humidity = dht.readHumidity(true);
    if (isnan(humidity)) 
    {
        Serial.println("Failed to read the humidity!");
    } 
    else
    {
        String message = "{\"sensor\": \"HUMIDITY\", \"value\": ";
        message.concat(humidity);
        message.concat("}");
        if (redis.publish("sensors", message.c_str()) == -1)
        {
            Serial.println("Failed to send the humidity over redis pub/sub!");
        }
    }
}
