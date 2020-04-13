<%@page import="java.net.URLEncoder"%>
<%@ page contentType="text/html;charset=utf-8" pageEncoding="utf-8" %>
<%@ page language="java"%>
<%@ page import="java.net.URLDecoder.*" %>
<%@ page import="java.io.BufferedInputStream"%>
<%@ page import="java.io.FileInputStream"%>
<%@ page import="java.io.File"%>
<%@ page import="java.io.IOException"%>
<%@ page import="javax.servlet.ServletException"%>
<%@ page import="javax.servlet.ServletOutputStream"%>
<%@ page import="javax.servlet.http.HttpServletRequest"%>
<%@ page import="javax.servlet.http.HttpServletResponse"%>

<%
	String contextRealPath = request.getSession().getServletContext().getRealPath("/");
	
	String getPath = request.getParameter("filepath");
	String getName = request.getParameter("filename");
	String getFolderName = request.getParameter("filefolder");

	String filename = new String(getName.getBytes("iso8859-1"), "UTF-8");
	String filePath = contextRealPath + getFolderName + File.separator + filename; 
	
	System.out.println("filename : " + filename);
	System.out.println("filePath : " + filePath);
			
	byte[] buffer = new byte[1024];

	ServletOutputStream out_stream	= null;
	BufferedInputStream in_stream	= null;

	File fis = new File(filePath);

	if(fis.exists())
	{
		try
		{
			response.setContentType("application/octet;charset=utf-8");
			//response.setHeader("Content-Disposition", "attachment; filename = \"" + filename + "\""); 
			response.setHeader("Content-Disposition", "attachment; filename=" + URLEncoder.encode(filename, "utf-8") + ";"); //수정일 : 2019.09.06 : 파일다운로드 시 한글깨짐 처리
			out.clear();
			out = pageContext.pushBody();

			out_stream = response.getOutputStream();
			in_stream = new BufferedInputStream(new FileInputStream(fis));

			int n = 0;
			while ((n = in_stream.read(buffer, 0, 1024)) != -1)
			{
				out_stream.write(buffer, 0, n);
			}

			System.out.println("fileDownload filename==>"+filename + ", Success. ");
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			if (in_stream != null)
			{
				try
				{
					in_stream.close();
				}
				catch (Exception e)
				{
					e.printStackTrace();
				}
			}
			if (out_stream != null)
			{
				try
				{
					out_stream.close();
				}
				catch (Exception e)
				{
					e.printStackTrace();
				}
			}
		}
	}
	else
	{
		System.out.println("fileDownload filename==>"+filename + ", No file name.");
		response.sendRedirect("unknownfile");
	}
%>

