/**
 * 所有访问数据的接口调用该服务
 */


import global from './global';


	const getJSON = (url,data) =>{

		return new Promise((resolve, reject) => {
			getData(url, data, "POST", "json",
			resolve, reject);
		});
	}

	const getData = (url, data, method, dataType, success, error ,theOptions) => {

		var options = {
			url: url,
			method: method,
			data: data,
			dataType: dataType
		};
		$.extend(options, theOptions);
		if(typeof data == 'string'){
			options.contentType  = 'application/json';
		}
		var request = $.ajax(options);

		request.done(function( data ) {
			if(dataType=='json'){ // dataType == json
				if(typeof data == 'object' && typeof data.rs != 'undefined'){
					if(data.rs==1){

						if(typeof success == 'function'){
							success.call(this, data.resultMessage,request);
						}
					}else{
						if(typeof error == 'function'){
							error.call(this, data.rsdesp,request);
						}else{
							alert(data.rsdesp);
						}
					}
				}
			}
			else{ //dataType == html
				if(typeof data == 'string' && data != 'error'){
					if(typeof success == 'function'){
						success.call(this, data,request);
					}
				}else{
					if(typeof error == 'function'){
						error.call(this, '请求数据失败，请稍后再试',jqXHR);
					}else{
						alert('请求数据失败，请稍后再试');
					}
				}
			}
		});

		request.fail(function( jqXHR, textStatus ) {
			if(jqXHR.status == 401){
				//go to login page

				return;
			}
			if(typeof error == 'function'){
				error.call(this, '请求数据失败，请稍后再试',jqXHR);
			}else{
				alert('请求数据失败，请稍后再试');
			}
		});
	}

export 	{getJSON };
