설치
==========
```
npm install -g newman 
npm install   
```

실행 방법
==========

#1. node로 소스코드 실행

해당 테스트 스크립트를 node로 실행 (주로 MQTT전송 등 다른 기능과 혼합해서 사용할 경우)

```
node ./TEST-V1_1-DeviceType.json ./env.dev.json
```


#2. newman으로 직접 실행  
주로 전체 컬렉션을 중간에 제어변화 없이 실행할 경우

```
newman run ../postman/TEST-V1_2-SWING.json -e ./env.dev.json
```

