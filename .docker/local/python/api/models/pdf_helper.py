import pathlib
import re
from io import StringIO

from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage

# PDFファイルが保存されているフォルダのパスを記入
PDF_DIRPATH = pathlib.Path(
    'documents/Man_Digest_v9.pdf'
    )

# 出力先フォルダのパス
OUTPUT_DIRPATH = pathlib.Path(
    '<変換した画像を保存したいフォルダのパス>'
    )


class PdfHelper(object):
    """PDFを操作するクラス"""

    def __init__(self):
        pass

    # search_text = 'ョンの表示がでて終了した時）「グラフメニュ」の「表示式」を選択して下さい。Ｓパ'
    def get_page_from_pdf(self, search_text: str) -> list[int]:

        # pdfminerの設定
        rsrcmgr = PDFResourceManager()
        codec = 'utf-8'
        laparams = LAParams()
        laparams.detext_vertical=True

        # PDFファイルを1ページずつ見て該当するかチェック
        pages = []
        with open(PDF_DIRPATH, 'rb') as fp:
            for i, page in enumerate(PDFPage.get_pages(fp)):
                outfp = StringIO()
                device = TextConverter(
                    rsrcmgr=rsrcmgr, # PDFResourceManagerオブジェクトを設定する
                    outfp=outfp, # 出力先のストリームオブジェクトを設定する
                    codec=codec,
                    laparams=laparams # LAParamsオブジェクトを設定する
                    )
                interpreter = PDFPageInterpreter(rsrcmgr, device)
                interpreter.process_page(page)

                # 1ページ分のPDF（for文で回しているため i+1 ページ目のPDF）を文字列化したもの
                extracted_text = outfp.getvalue()

                # logger.info(f"{i+1}ページ目のPDF(extracted_text): {extracted_text}")

                # ページ抽出：抽出条件（演習問題のページ）に該当すればTrue
                # 一致した場合：<re.Match object; span=(27, 34), match='S パラメータ'>
                # 一致しなかった場合: None
                extracted_page = re.search(search_text, extracted_text)

                # logger.info(f"extracted_page: {extracted_page}")

                # extracted_page.group() は 検索文字(「S パラメータ」)
                if extracted_page:
                    pages.append(i + 1)
        return pages


    # AA \n\n BBBBB \n\n CCC \n\n DD から一番長い文章(BBBBB)を取り出し、PDF検索できる形の配列に変換する
    def extract_main_text(self, text_with_noise: str) -> list[str]:

        # str = '図 19 解析結果（S パラメータ特性）\n\nもしシミュレーションを行なったにもかかわらず表示されない場合は、（シミュレーシ ョンの表示がでて終了した時）「グラフメニュ」の「表示式」を選択して下さい。Ｓパ ラメータバッファの選択と表示式を確認して下さい。もし異なる場合は、図の様にして 下さい。\n\nパラメータの選択\n\n図 20'

        # 文字列を \n\n で分割して配列化
        list_text_with_noise = text_with_noise.split('\n\n')

        # arrs = ['図 19 解析結果（S パラメータ特性）', 'もしシミュレーションを行なったにもかかわらず表示されない場合は、（シミュレーシ ョンの表示がでて終了した時）「グラフメニュ」の「表示式」を選択して下さい。Ｓパ ラメータバッファの選択と表示式を確認して下さい。もし異なる場合は、図の様にして 下さい。', 'パラメータの選択', '図 20']

        # { '文字列' : 文字数 }の形にする。{ 'aaa' : 3 , 'bbbb' : 4 } の形
        str_counts = dict()
        for index, arr in enumerate(list_text_with_noise):
          str_count = len(arr)
          str = arr
          str_counts[str] = str_count

        # { 'aaa' : 3 , 'bbbb' : 4 } の中で一番文字列が長いものを抽出
        sorted_str_counts = sorted(str_counts.items(), key=lambda x:x[1], reverse=True)
        # logger.info(sorted_str_counts[0][0])

        # spl = arrs[1].split(' ')
        main_text_list = sorted_str_counts[0][0].split(' ')

        return main_text_list

        # result = [
        #   'もしシミュレーションを行なったにもかかわらず表示されない場合は、（シミュレーシ',
        #   'ョンの表示がでて終了した時）「グラフメニュ」の「表示式」を選択して下さい。Ｓパ',
        #   'ラメータバッファの選択と表示式を確認して下さい。もし異なる場合は、図の様にして',
        #   '下さい。'
        # ]

    # ベクトル検索で取得したtextを元に、そのtextがpdfのどこに書いてあるのか文字列一致検索をかけてpdfページを取得
    def get_pdf_pages(self, reference_texts: list[str]) -> list[int]:
        pdf_pages = []
        # reference_texts は docs_by_type["texts"] のこと
        for reference_text in reference_texts:
            # AA \n\n BBBBB \n\n CCC \n\n DD から一番長い文章(BBBBB)を取り出し、PDF検索できる形の配列に変換する
            main_text_list = self.extract_main_text(reference_text)

            # 0番目のやつだけで検索かければよい（他のでかけても同じ結果が出るはずだから）
            pages = self.get_page_from_pdf(main_text_list[0])

            # 0番目のページだけ入れてる（全部入れた方がいい？）
            pdf_pages.append(pages[0])

            # self.logger.info(f"pages: {pages}")

        return pdf_pages
