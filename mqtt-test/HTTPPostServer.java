import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.net.ServerSocket;
import java.text.SimpleDateFormat;
import java.util.Calendar;

class HTTPPostServer {

	public static void main(String[] args) throws Exception {
	    // création de la socket
		String arg1 = args[0];
		String arg2 = args[1];
	    //int port = 9900;
		int port = Integer.parseInt(arg1);
	    int contentLength = 0;
	    ServerSocket serverSocket = new ServerSocket(port);
	    System.err.println("server port : " + port);

	    // repeatedly wait for connections, and process
	    while (true) {
	        Socket clientSocket = serverSocket.accept();
	        if (arg2 != null && arg2.equals("on")) {
	        	System.err.println("Client Connected");
	        }

	        BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
	        BufferedWriter out = new BufferedWriter(new OutputStreamWriter(clientSocket.getOutputStream()));

	        String s;
	        while ((s = in.readLine()) != null) {
	        	if (arg2 != null && arg2.equals("on")) {
	        		System.out.println(s);
	        	}
	            final String contentHeader = "Content-Length: ";
	            if (s.startsWith(contentHeader)) {
	                contentLength = Integer.parseInt(s.substring(contentHeader.length()));
	            }
	            if (s.isEmpty()) {
	                break;
	            }
	        }
	        
	        StringBuilder body = new StringBuilder();
	        int c = 0;
            for (int i = 0; i < contentLength; i++) {
                c = in.read();
                body.append((char) c);
            }
            if (arg2 != null && arg2.equals("on")) {
            	
            	Calendar calendar = Calendar.getInstance();
            	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS");
            	System.out.println("[currentTime] " + dateFormat.format(calendar.getTime()));
            	  
            	System.out.println(body);
            }

//	        out.write("HTTP/1.1 200 OK\r\n");
	        out.write("HTTP/1.1 201 Created\r\n");
	        out.write("Date: Fri, 31 Dec 1999 23:59:59 GMT\r\n");
	        out.write("Server: Apache/0.8.4\r\n");
	        out.write("Content-Type: text/html\r\n");
	        out.write("Content-Length: 22\r\n");
	        out.write("Expires: Sat, 01 Jan 2000 00:59:59 GMT\r\n");
	        out.write("Last-modified: Fri, 09 Aug 1996 14:21:40 GMT\r\n");
	        out.write("\r\n");
	        out.write("<TITLE>Exemple</TITLE>");
	        // on ferme les flux.
	        if (arg2 != null && arg2.equals("on")) {
	        	System.err.println("Connection terminated");
	        }
	        out.close();
	        in.close();
	        clientSocket.close();
	    }
	}
}