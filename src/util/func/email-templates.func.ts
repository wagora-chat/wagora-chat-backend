export function getEmailTemplate(tempPassword: string): string {
    return `
        <div style="background-color: #f2f2f2; padding: 20px;">
            <div style="
                font-family: Arial, sans-serif;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
                max-width: 500px;
                margin: 0 auto;
            ">
                <h2 style="
                    color: #9b59b6;
                    text-align: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #f2f2f2;
                    padding-bottom: 10px;
                ">
                    임시 비밀번호 안내
                </h2>
                <p style="
                    font-size: 16px;
                    color: #333333;
                    line-height: 1.5;
                ">
                    안녕하세요, <br><br>
                    요청하신 임시 비밀번호는 아래와 같습니다. 로그인 후, 보안을 위해 비밀번호를 꼭 변경해주시기 바랍니다.
                </p>
                <div style="
                    background-color: #9b59b6;
                    color: #ffffff;
                    font-size: 18px;
                    text-align: center;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                    letter-spacing: 1px;
                ">
                    ${tempPassword}
                </div>
            </div>
        </div>
    `;
}
