
#include<stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <arpa/inet.h>
int main() {
int serversocket,clientsocket;
char msg[100];
struct sockaddr_in serverAddr,clientAddr;
socklen addr_size;
serverAddr.sin_family=AF_INET;
serverAddr.sin_port=htons(1234);
serverAddr.sin_addr.s_addr=INADDR_ANY;
bind(serversocket,(struct sockaddr*)&serverAddr,sizeof(serverAddr));
listen(serversocket,1);
printf("Server waiting for connection");
addr_size=sizeof(clientAddr);
clientsocket=accept(serversocket,(struct sockaddr*)&clientAddr,&addr_size);
printf("client connected\n");
recv(clientsocket,msg,sizeof(msg),0);
printf("client says:%s\n",msg);
send(clientsocket,"message received",strlen("message received"),0);
close(clientsocket);
close(serversocket);
return 0;
}


