#version 330 core
out vec4 FragColor;

in vec3 Normal;  
in vec3 FragPos;  
  
uniform vec3 viewPos; 

uniform sampler2D refractionMap; // from framebuffer

vec3 u_baseColor = vec3(0.5216, 0.5216, 0.5216);
vec3 u_lightDir = vec3(0.3255, 0.0, 0.0);
vec3 u_lightColor = vec3(1.0,1.0,1.0);

float specular(vec3 light, float shininess, float diffuseness) 
{
    vec3 viewDir = normalize(viewPos - FragPos);
	vec3 normal = Normal;
	vec3 lightVector = normalize(-light);
	vec3 halfVector = normalize(viewDir + lightVector);

	float NdotL = dot(normal, lightVector);
	float NdotH =  dot(normal, halfVector);
	float kDiffuse = max(0.0, NdotL);
	float NdotH2 = NdotH * NdotH;

	float kSpecular = pow(NdotH2, shininess);
	return  kSpecular + kDiffuse * diffuseness;
}

float fresnel(vec3 eyeVector, vec3 worldNormal, float power) 
{	
	float fresnelFactor = abs(dot(eyeVector, worldNormal));
  	float inversefresnelFactor = 1.0 - fresnelFactor;
  	return pow(inversefresnelFactor, power);
}

void main()
{
    float uFresnelPower = 8.0;
    float uShininess = 1.1;
 	float uDiffuseness = .0;
 	vec3 uLight = vec3(1.0, 1.0, 1.0);

    vec3 norm = normalize(Normal);
    vec3 viewDir = normalize(viewPos - FragPos);
    float iorRatio = 1.0/2.5; // Index of refraction for glass
    vec3 refractVec = refract(viewDir, norm, iorRatio);

    vec2 screenUV = gl_FragCoord.xy / vec2(800., 600.);
    vec2 offsetUV = screenUV + refractVec.xy * 0.03;
    offsetUV = clamp(offsetUV, 0.0, 1.0);
    vec4 lensColor = texture(refractionMap, offsetUV);

    float f = fresnel(viewDir, norm, uFresnelPower);
  	lensColor.xyz += f * 0.1 * vec3(1.0, 1.0, 1.0);

    float specularLight = specular(uLight, uShininess, uDiffuseness);
	lensColor.xyz += specularLight * 0.0001 * u_lightColor;

    FragColor = vec4(lensColor.xyz, 1.0); // Use the refracted color from the texture

    

    //vec3 result = (ambient + diffuse + specular) * objectColor;
    //FragColor = vec4(result, 1.0);
} 