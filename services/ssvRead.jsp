<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.io.File" %>
<%@ page import="java.io.FileInputStream" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="javax.servlet.http.HttpServletResponse" %>
<%!
char a = (char) 0x1e;
char b = (char) 0x1f;
String RS = String.valueOf(a);
String US = String.valueOf(b);

private void flush(HttpServletResponse httpResponse, StringBuffer sb) throws Exception {
	PrintWriter out = null;
	out = httpResponse.getWriter();
	out.print(sb);
}
%><%
out.clearBuffer();
int nCnt = 0;
int nFirstCnt = 0;
int len = 0;
String isCompress = null;
FileInputStream fis = null;
InputStreamReader isr = null;
BufferedReader bs = null;
StringBuffer sbSsv = null;

try {
	String rowcount = request.getParameter("rowcount");
	
	if (rowcount == "") {
		rowcount = "10000";
	}
	sbSsv = new StringBuffer();
	sbSsv.append("SSV:UTF-8"+RS);
	sbSsv.append("ErrorCode=0"+US+"ErrorMsg=SUCCESS"+RS);
	sbSsv.append("Dataset:").append("output").append(RS);
	sbSsv.append("_RowType_"+US);
	sbSsv.append("id:STRING(50)"+US+"first_name:STRING(50)"+US+"last_name:STRING(50)"+US+"email:STRING(50)"+US+"gender:STRING(50)"+US+"ip_address:STRING(50)"+US+"state:STRING(50)"+US+"street:STRING(50)"+US+"date:STRING(50)"+US+"domain:STRING(50)"+US+"guid:STRING(50)"+RS);
   	fis = new FileInputStream(new File(getServletContext().getRealPath("/") + "dat/ssv_" + rowcount + ".dat"));
	isr = new InputStreamReader(fis, "utf-8");
	bs = new BufferedReader(isr);
    len = 0;
    while ((len = bs.read()) != -1) {
    	sbSsv.append((char)len);
    	if(len == 30) {
    		if(nCnt == nFirstCnt) {
    			flush(response, sbSsv);
        		sbSsv = new StringBuffer();	
    			nCnt = 0;
    		} else {
    			nCnt++;	
    		}
    	}
    }
    flush(response, sbSsv);
    
} catch(Exception e) {
    e.printStackTrace();
}


try {
	if(isr != null) {
		isr.close();
	}
	if(fis != null) {
		fis.close();	    		
	}
	if(bs != null) {
		bs.close();
	}
} catch (Exception e) {
	e.printStackTrace();
}
%>